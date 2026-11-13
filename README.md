# 이채령 포트폴리오: Career File

채용 페이지의 '모집 분야 안내' 형식을 빌려, 지원 직무와 경험을 맞춰 보여주는 포트폴리오 사이트입니다.

```bash
npm install
npm run dev      # 로컬 실행
npm run build    # dist/ 생성
```

- 문구와 수치: `src/content.js`
- 이력서 링크: `public/resume.pdf`를 넣고 `src/content.js`의 `RESUME_URL`을 `"/resume.pdf"`로 바꾸면 버튼이 나타납니다.
- 배포: Vercel에서 이 저장소를 Import (Framework: Vite, 설정 기본값).
