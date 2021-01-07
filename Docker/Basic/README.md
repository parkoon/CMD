# 내 느낌대로 도커

## 도커를 왜 사용해야 하나?

1. 개발용 컴퓨터에서와 서버용 컴퓨터의 환경이 동일해야 합니다.
2. 서버용 컴퓨터에서 **서비스 A**는 **노드 12** 버전을 사용하고 **서비스 B**는 **노드 13** 버전을 사용할 때 노드 버전의 구분이 필요합니다.
3. 2번의 해결방법으로는 가상환경을 생각 할 수 있지만, 가상환경을 사용하는 것은 서버용 컴퓨터에 또다른 컴퓨터를 하나 더 놓는것이 된다. 이렇게 되면, 컴퓨터 성능과 자원을 나눠(공유X)쓰게 된다. 성능을 활용하는데 적합하지 않습니다.
4. 도커 컨테이너는 컴퓨터 자원을 공유해서 사용합니다.

## 자주 사용하는 도커 명령어

### 동작중인 컨테이너 확인하기

```
docker ps
```

### 컨테이너 삭제

```
docker rm {container_id | container_name}
```

### 모든 컨테이너 삭제

```
docker rm $(docker ps -aq)
```

### 이미지 만들기

```
docker build -t {image_name} // -t or --tag
```

### 이미지 확인하기

```
docker images
```

### 도커 실행하기

```
docker run --name {container_name} -it -p {host_port}:{container_port} {image_name}
```

#### --name

`--name` 옵션을 사용해서 컨테이너에 이름을 부여해주고 해당 이름으로 컨테이너를 식별할 수 있습니다.

#### -it

`-it` 옵션은 컨테이너를 종료하지 않고, 터미널의 입력을 계속해서 컨테이너로 전달하기 위해서 사용합니다.

#### -p

`p` 옵션은 호스트 컴퓨터와 컨테이너간의 포트 배포 / 바인드를 위해서 사용됩니다. 아래 예시는 `8080` 포트를 리스닝하고 있는 프론트엔드 서버를 호스트 컴퓨터에서 `80` 포트로 접속 할 수 있게 해줍니다.

```
docker run --name frontend-con -v $(pwd):/home/node/app -p 80:8080 frontend-img
```

#### -v

`-v` 옵션은 컨테이너의 데이터 휘발성으로 인해서 데이터를 컨테이너가 아닌 호스트에 저장할 때, 또는 컨테이너끼리 데이터를 공유할 때 상용합니다.

### 이미지 삭제

```
docker rmi {option} {image_id}
```

> 컨테이너가 있다면 이미지를 삭제할 수 없습니다. 이 때, 강제삭제인 `-f` 옵션을 사용합니다.

### 모든 컨테이너 중지

```
docker stop $(docker ps -aq)
```

### 상용되지 않는 모든 도커 요소 (컨테이너, 이미지, 네트워크, 볼륨 등) 삭제

```
docker system prune -a
```

### 도커 컴포즈 실행

```
docker-compose up
```

### Dockerfile

> 나만의 이미지를 만들기 위한 설계도

```
# 기반이 되는 이미지 레이어
# 해당 명령어가 실행되면 `docker hub`로 부터 node 이미지를 받아온다.
FROM node:12.18.4

# 이미지 생성 과정에서 실행할 명령어
RUN npm install -g http-server

# 이미지 내에서 명령어를 실행할(현 위치로 잡을) 디렉토리 설정
WORKDIR /home/node/app

# 컨테이너 실행시 실행할 명령어
CMD ["http-server", "-p", "8080", "./public"]
```

## Dockerfile 명령어 `ARG` 와 `ENV` 차이점

> 회사 코드를 인용하는데, 알고보니 이상한점이 한 두개가 아니다.

### ARG

```
# ARG <name>[=<default value>]
ARG QAMS
ARG FOO=bar
```

- 이미지 빌드를 위해 `Dockerfile` 내에서 사용하기 위한 값입니다.
- `이름`만 입력하고 `값`을 입려하지 않으면 `이름`이 `default value`로 설정됩니다.
- `빌드 시점`에서만 사용되므로, 해당 값을 유지하고 싶지 않을 때 `ARG`를 사용합니다.
- `docker build` 명령어에 `--build-arg` 옵션으로 전달 또는 덮어쓰기가 가능합니다.
- `secret-key` 와 같이 중요한 값들은 절대 입력하지 않습니다. 서버의 환경변수를 활용합니다.

```
docker build --build-arg QAMS=${https://qa-qams.qualson.com} -t realclass2-node-dev .

```

### ENV

```
# ENV <name> <value> | <name>=<value>
```

- 이미지 빌드를 위해 `Dockerfile` 내에서 사용하기 위한 값입니다.
- `런타임 시점` 에서 사용됩니다.
- `build run` 명령어에 `-e` 또는 `--env <name>=<value>` 옵션으로 전달 또는 덮어쓰기가 가능합니다.

## Docker compose

```
version: '3'
services:
  database:
    # Dockerfile이 있는 위치
    build: ./database
    # 내부에서 개방할 포트 : 외부에서 접근할 포트
    ports:
      - "3306:3306"
  backend:
    build: ./backend
    # 연결할 외부 디렉토리 : 컨테이너 내 디렉토리
    volumes:
      - ./backend:/usr/src/app
    ports:
      - "5000:5000"
    # 환경변수 설정
    environment:
      - DBHOST=database
  frontend:
    build: ./frontend
    # 연결할 외부 디렉토리 : 컨테이너 내 디렉토리
    volumes:
      - ./frontend:/home/node/app
    ports:
      - "8080:8080"
```
