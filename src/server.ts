import { makeApp } from './app';

const PORT = 3000;
const app = makeApp();

app.listen(PORT, () => {
  console.log(`🍕 Server running on http://localhost:${PORT}`);
});