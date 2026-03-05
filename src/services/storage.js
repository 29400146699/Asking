
const STORAGE_KEY = "sifou_data";

export function initStorage(initialData) {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
}

export function readStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function writeStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 可选：开发时想一键清空数据用
export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("auth");
}
