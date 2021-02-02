> 이 글은 프론트엔드 개발자가 백엔드에 깊은 지식없이 백엔드에 입문하는 과정을 다루고 있습니다. 정확하지 않는 내용이 있는 경우 시끄럽게 알려주시면 조용히 고치도록 하겠습니다.

## 들어가는 말

실무에서 3년 정도의 경험이 있는 프론트엔드 개발자라면 아래 정도의 스펙을 가지고 있을 것이다. _(그 이상이라면 당신을 채용하겠습니다.)_

- `HTML / CSS`
- `Javascript`
- `Typescript`
- `sass` 와 같은 `css` 전 처리기
- `React` `Vue` `Angular`
- `Next.js` 에 준하는 프레임워크
- `Node.js`
- `Express.js`

위 스펙을 통해 프로젝트를 2~3회 정도 진행해봤다면, 중니어(주니어와 시니어의 사이) 정도의 실력이라 할 수 있다. 이 쯤 되면 아래와 같은 고민을 하기 시작한다.

> 🧐 내 실력을 더 쌓으려면 무엇을 더 공부해야할까?

현재 스펙을 좀 더 심도있게 공부할 수 있겠지만, 평소에 `Node.js`에 관심 있었기 때문에 스펙을 백엔드 영역까지 넓히고 싶은 마음이 생겼다. 들리는 소문으로는 백엔드 영역을 알면 백엔드 개발자의 고충을 이해하고, 협업하는데 도움이 된다는 얘기도 있다.

`Javascript` 와 `Node.js` 는 어느 정도 할 줄 아는 상태에서, SQL 을 따로 공부하지 않고 편하게 사용할 수 있을 것만 같은 몽고디비가 가장 적합해 보였다.

하지만, 현재 회사에서는 **RDBMS**를 사용하고 있기에 **sequalize** 로 **postgreSQL** 를 다루는 **TypeORM** 으로 결정했다.

이제 본격적으로 **TypeORM** 을 프로젝트에 적용하기까지의 여정을 떠나보자. ✈️

## postgreSQL 설치 및 기본 설정

~~프론트엔드 개발자에게 데이터베이스를 설치하는게 굉장히 낯설게 느껴진다. 뭔가 엄청난 것을 설치해야 할 것 같고 그 과정에서 많은 에러가 발생할 것만 같다.~~

그래도 설치해보자.

### postgreSQL 설치

```
$ brew install postgresql
```

처음에 걱정한 것과 다르게 한 줄로 설치가 끝났다!👏 (윈도우는 [여기서](https://www.postgresql.org/download/windows/) 다운받자.)

### postgreSQL 설치 확인

제대로 설치가 되었는지 확인해보자.

```
$ postgres -V
```

![](https://images.velog.io/images/parkoon/post/79c700ee-3a0b-4e2f-8260-4fa308ba7ab8/image.png)

버전이 나오면 정상적으로 설치된 것이다.

### 재부팅 시 postgreSQL 자동 실행

추가로, 컴퓨터가 재부팅 될 때마다 데이터베이스를 활성화시키는 번거로움을 없애기 위해 아래 명령을 실행한다.

```
$ pg_ctl -D /usr/local/var/postgres start && brew services start postgresql
```

### 권한 생성

postgreSQL 을 설치하면 기본 권한과 postgres 명칭의 데이터베이스를 생성해준다. 아래 명령어로 데이터베이스에 접속할 수 있다.

그리고 현재 등록되어 있는 권한을 확인하기 위해 `\du` 를 입력한다.

```
$ psql postgres
postgres=# \du
```

![](https://images.velog.io/images/parkoon/post/cf4ace96-3cf0-440a-8ca5-7c793e978aaa/image.png)

언뜻보면, 여기 있는 사용자를 바로 사용해도 되겠다고 생각할 수 있겠지만, 실제 서비스를 개발할 때에는 최소한의 권한을 받고 사용하는것이 예상하지 못한 ~~야근🔥~~을 막을 수 있다.

권한을 생성해보자.

```
postgres=# CREATE ROLE koon LOGIN WITH PASSWORD '1234';
```

> SQL 입력후엔 꼭 세미콜론 (;) 을 입력하자. 구글에 _CREATE ROLE not working in psql_ 검색하는 것을 미연에 방지할 수 있다. 🙃

그리고 다시 `\du` 로 권한을 검색해보면 `koon` 이라는 권한이 생긴것을 확인 할 수 있다.

![](https://images.velog.io/images/parkoon/post/5220a666-1eb2-48e4-b7e8-2be7ec96de59/image.png)

`koon` 에게는 아직 아무 권한이 없기 때문에 데이터베이스를 만들 수 없다. `koon` 에게 데이터베스를 생성할 수 있는 힘을 주자. 💪💪💪

```
postgres=# ALTER ROLE koon CREATEDB;
postgres=# \du
```

![](https://images.velog.io/images/parkoon/post/a31a6c26-6b28-4f98-a016-21f1d30565f2/image.png)

마지막으로, posgreSQL 을 koon 권한으로 실행해서 우리가 공부할 데이터베이스를 생성하고 연결하기만 하면 된다.

`ctrl + z` 로 postgreSQL 실행을 취소하고 koon 권한으로 접속해보자.

```
$ psql postres -U koon
```

![](https://images.velog.io/images/parkoon/post/5f5c7157-b827-460d-a2e0-92a87e19903e/image.png)

> 여기서 미세한 변화를 감지했을지 모르겠지만, `#` 에서 `>` 로 바꼇다. 현재 권한이 더 이상 최상위(?) 권한이 아님을 의미한다.

### 데이터베이스 생성

권한을 생성했다면, 이제 아래 명령어를 입력해 _awesome_typeorm_ 이라는 데이터베이스를 생성해보자.

```
postgres=> CREATE DATABASE awesome_typeorm;
posgres=> \list
```

> `\list` 명령어로 데이터베이스 목록을 조회할 수 있습니다.

![](https://images.velog.io/images/parkoon/post/7c21e3f1-7e77-4223-b5c0-1d393ed92f42/image.png)

### 데이터베이스 연동

마지막으로 데이터베이스만 연동하면 된다. `\c` 명령어로 방금 생성한 _awesome_typeorm_ 에 연결해보자.

```
postgres=> \c awesome_typeorm
```

![](https://images.velog.io/images/parkoon/post/c927e6b6-80ba-43f3-87b4-68f880062669/image.png)

데이터베이스 설치 및 기본 설정이 모두 끝났다! 👏
이제 여러분은 데이터베이스를 설치하고 권한을 설정하고 데이터 베이스를 설치하고 기본 설정을 할 수 있는 프론트엔드 개발자가 되었다. 🎊

그래도 우리는 양심이 있지 않는가. 최소한 이 글에 나온 키워드를 본인에게 설명할 수 있다는 전제하게 그렇다고 하자.

- `brew install postgresql`
- `postgres -V`
- `psql postgres`
- `psql posgres -U koon`
- `\du`
- `\list`
- `CREATE ROLE koon LOGIN WITH PASSWORD '1234';`
- `ALTER ROLE koon CREATEDB;`
- `#` vs `>`
- `CREATE DATABASE awesome_typeorm`
- `\c awesome_typeorm`

다음 포스팅에서는 TypeORM 기본 세팅을 다뤄볼 것이다.
