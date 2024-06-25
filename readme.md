# Front_Assignment

## 시작하기

아래의 단계를 따라 개발 서버를 설정하고 실행하세요.

### 1. 리포지토리 클론

다음 명령어를 사용하여 이 리포지토리를 로컬 머신에 클론합니다:

```sh
git clone https://github.com/javascriptbiggosoo/MementoAI_Front_Assignment.git
```

### 2. 의존성 설치

Yarn을 사용하여 프로젝트의 의존성을 설치합니다:

```sh
yarn
```

### 3. 개발 서버 실행

다음 명령어를 사용하여 개발 서버를 시작합니다:

```sh
yarn start
```

## 신경쓴부분

- 커스텀훅을 이용하여 비즈니스로직과 UI로직 분리
- 리액트 메모를 이용하여 컴포넌트 최적화
- 토스트 디바운싱
- dragUpdate, dragEnd 별 UX 전반

## 어려웠던 부분

- 멀티드래그 종료 후 칼럼 수정 로직
- 멀티드래그, 노멀드래그 간 중복코드 판별 등 코드구조 개선
