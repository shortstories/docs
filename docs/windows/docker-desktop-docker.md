# Docker desktop 없이 docker 환경 세팅하기

회사에서 라이센스를 구입하기가 여러모로 귀찮으므로 docker desktop을 사용하기 난감함.

wsl2를 쓰면 docker를 기본적으로 세팅해서 사용할 수 있지만 나는 wsl1을 쓰고 싶음.&#x20;

wsl2를 쓰기 싫은 가장 큰 이유는 파일 시스템의 차이로 인해 성능을 많이 날려먹는 것. 내 경우 wsl의 config에서 mount root를 `/`로 잡아서 사용하고 있음. 이렇게 하면 소스코드들을 윈도우에 저장해놓고 goland든 vscode든 linux 작업이든 모두 하나의 디렉토리에서 실행할 수 있어서 적잖이 만족하고 있음. 근데 wsl2를 쓸 경우 이 windows 디렉토리에서 뭔가 작업을 할 때 어마어마한 오버헤드가 발생함.&#x20;

그리고 wsl2의 버그(https://github.com/microsoft/WSL/issues/8725)때문에 램을 거의 무제한적으로 차지하는데 이것도 마음에 안듬.

따라서 wsl1을 기본적으로 사용하면서 리소스 제한을 걸고 docker랑 k8s만 띄운 별도의 wsl2 인스턴스를 생성해서 사용하기로 결정.

### 1. wsl2 세팅

우선 관리자 권한을 가진 cmd 또는 powershell을 하나 띄워서 진행해야함.

&#x20;내 경우엔 기존 wsl1용으로 `Ubuntu-22.04` distro를 사용하고 있었기 때문에 이번에는 `Ubuntu-20.04` distro를 써서 docker 및 k3s를 구축하기로 결정.

```shell
:: 뭘 설치해야할지 모르겠다면 wsl --list --online 명령어로 확인하여 선택.
:: wsl --list 까지만 치면 현재 설치되어있는 것들을 확인할 수 있음.

wsl --set-default-version 2
wsl --install Ubuntu-20.04
```

wsl2 인스턴스 내부로 들어가서 `/etc/wsl.conf` 파일을 생성하여 아래와 같은 내용 넣기. 이렇게 해야 wsl2에서도`sudo systemctl ...` 명령어를 사용할 수 있음.

```toml
[boot]
systemd=true
```

windows의 `%USERPROFILE%\.wslconfig` 파일에 아래 내용 넣기. 이렇게 해야 wsl2 인스턴스가 무제한적으로 메모리를 차지하는 것을 막을 수 있음.
networkingMode의 경우 기본옵션은 nat임. mirrored로 해주면 wsl2의 네트워크가 호스트의 네트워크와 동일한 것처럼 사용할 수 있음.
이렇게 해야 윈도우 호스트나 wsl1에서 docker나 k3s로 접근 가능해짐.

```toml
[wsl2]
memory=8GB
networkingMode=mirrored
```

이후 `wsl.exe -t Ubuntu-20.04` 명령어로 재시작.

다음부터 docker가 필요하면 터미널에서 새로 만든 ubuntu를 실행하면 됨.

### 2. docker daemon 설치

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

`sudo vi /etc/docker/daemon.json` 명령어로  아래와 같이 daemon config을 만든 다음&#x20;

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": true,
  "features": {
    "buildkit": true
  },
  "hosts": [
    "fd://",
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:2375"
  ]
}
```

`sudo systemctl edit docker` 명령어를 실행하여 아래와 같이 수정.

```systemd
### Editing /etc/systemd/system/docker.service.d/override.conf
### Anything between here and the comment below will become the contents of the drop-in file

[Service]
ExecStart=
ExecStart=/usr/bin/dockerd --containerd=/run/containerd/containerd.sock

### Edits below this comment will be discarded
#...
```

그 다음 아래 명령어로 재시작 및 실행 확인

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker.service
sudo netstat -lntp | grep dockerd
```

### 3. k3s 설치

```bash
curl -sfL https://get.k3s.io | sh -s - --docker
```
### 4. k3s 서버 정보 및 인증 정보 가져오기

`/etc/rancher/k3s/k3s.yaml` 파일 내용 참조



이제 세팅은 완료되었으니 `docker -H tcp://127.0.0.1:2375 ps` 명령어를 window와 wsl1 환경에서 테스트. 문제없다면 마찬가지로 환경변수에 `DOCKER_HOST=tcp://127.0.0.1:2375` 옵션을 넣어서 마무리
