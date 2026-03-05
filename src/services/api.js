// src/services/api.js
import { initStorage, readStorage, writeStorage } from "./storage";
import { mockData } from "./mockData";

function safeRead() {
  const data = readStorage();
  if (!data) return { ...mockData };

  // 把旧结构 users: [{id: '1'}] 转成 [{userId: '1'}]
  const migratedUsers = Array.isArray(data.users)
    ? data.users.map((u) => ({
      ...u,
      userId: u.userId ?? u.id,   // 关键：补 userId
    }))
    : mockData.users;

  return {
    ...mockData,
    ...data,
    users: migratedUsers,
    issues: data.issues ?? mockData.issues,
    types: Array.isArray(data.types) && data.types.length ? data.types : mockData.types,
    comments: data.comments ?? mockData.comments,
    interviewCategories: data.interviewCategories ?? mockData.interviewCategories,
    interviewQuestions: data.interviewQuestions ?? mockData.interviewQuestions,
    books: data.books ?? mockData.books,
  bookComments: data.bookComments ?? mockData.bookComments,
  };
}



export const api = {
  init() {
    initStorage(mockData);
  },

  auth: {
    // 检查用户名是否存在
    checkUsername(username) {
      return new Promise((resolve) => {
        const data = safeRead();
        const exists = data.users.some((u) => u.username === username);
        resolve({ exists });
      });
    },

    // 注册
    register({ username, password }) {
      return new Promise((resolve, reject) => {
        const data = safeRead();

        if (!username || !password) {
          reject("请填写用户名和密码");
          return;
        }

        const exists = data.users.some((u) => u.username === username);
        if (exists) {
          reject("用户名已存在");
          return;
        }

        const newUser = {
          userId: Date.now().toString(),
          username,
          password,
          avatar: "",
        };

        data.users.push(newUser);
        writeStorage(data);

        resolve({ userId: newUser.userId, username: newUser.username });
      });
    },

    // 登录
    login({ username, password }) {
      return new Promise((resolve, reject) => {
        const data = safeRead();

        if (!username || !password) {
          reject("请填写用户名和密码");
          return;
        }

        const user = data.users.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          reject("用户名或密码错误");
          return;
        }

        const token = "mock-token-" + user.userId;

        const authPayload = {
          token,
          user: { userId: user.userId, username: user.username, avatar: user.avatar || "" },
        };
        localStorage.setItem("auth", JSON.stringify(authPayload));
        resolve(authPayload);
      });
    },

    // 获取当前登录状态（刷新后也能读到）
    getCurrentUser() {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    },

    // 退出登录
    logout() {
      localStorage.removeItem("auth");
    },
  },
  issue: {
    // 获取问答列表：分页/筛选/排序
    list(params = {}) {
      return new Promise((resolve) => {
        const data = safeRead();
        const {
          page = 1,
          pageSize = 10,
          typeId,
          keyword,
          sort = "new", // "new" | "hot"
        } = params;

        // 1) 只取有效数据
        let list = (data.issues || []).filter((it) => it.issueStatus === true);

        // 2) 按标签筛选
        if (typeId) {
          list = list.filter((it) => it.typeId === typeId);
        }

        // 3) 关键字搜索（标题 + 内容纯文本）
        if (keyword && keyword.trim()) {
          const kw = keyword.trim().toLowerCase();
          list = list.filter((it) => {
            const title = (it.issueTitle || "").toLowerCase();
            const text = (it.issueContent || "").toLowerCase();
            return title.includes(kw) || text.includes(kw);
          });
        }

        // 4) 排序：new / hot
        list.sort((a, b) => {
          if (sort === "hot") {
            // 热度：优先回答数，再看浏览数，再看时间
            if ((b.commentNumber || 0) !== (a.commentNumber || 0))
              return (b.commentNumber || 0) - (a.commentNumber || 0);
            if ((b.scanNumber || 0) !== (a.scanNumber || 0))
              return (b.scanNumber || 0) - (a.scanNumber || 0);
          }
          // 默认按时间倒序
          return Number(b.issueDate || 0) - Number(a.issueDate || 0);
        });

        const total = list.length;

        // 5) 分页
        const start = (page - 1) * pageSize;
        const pageItems = list.slice(start, start + pageSize);

        // 6) 组装 author + tag（把 userId/typeId 关联成对象）
        const result = pageItems.map((it) => {
          const author = (data.users || []).find(
            (u) => String(u.userId) === String(it.userId)
          );
          const tag = (data.types || []).find((t) => t.typeId === it.typeId);

          const commentCount = (data.comments || []).filter(
            (c) => String(c.issueId) === String(it.issueId)
          ).length;

          return {
            issueId: it.issueId,
            title: it.issueTitle,
            contentPreview: it.issueContent.slice(0, 120),
            date: it.issueDate,
            scanNumber: it.scanNumber || 0,
            commentNumber: commentCount,
            author: author
              ? { userId: author.userId, username: author.username, avatar: author.avatar || "" }
              : null,
            tag: tag ? { typeId: tag.typeId, typeName: tag.typeName } : null,
          };
        });

        resolve({ page, pageSize, total, list: result });
      });
    },

    // 获取问答详情：返回完整内容 + author/tag
    detail(issueId) {
      return new Promise((resolve, reject) => {
        const data = safeRead();
        const it = (data.issues || []).find(
          (x) => x.issueId === issueId && x.issueStatus === true
        );

        if (!it) {
          reject("该问答不存在或已下架");
          return;
        }

        const author = (data.users || []).find(
          (u) => String(u.userId) === String(it.userId)
        );
        const tag = (data.types || []).find((t) => t.typeId === it.typeId);
        const commentCount = (data.comments || []).filter(
          (c) => String(c.issueId) === String(it.issueId)
        ).length;

        resolve({
          issueId: it.issueId,
          title: it.issueTitle,
          issueContent: it.issueContent, // 详情给全文
          date: it.issueDate,
          scanNumber: it.scanNumber || 0,
          commentNumber: commentCount,
          author: author
            ? { userId: author.userId, username: author.username, avatar: author.avatar || "" }
            : null,
          tag: tag ? { typeId: tag.typeId, typeName: tag.typeName } : null,
        });
      });
    },

    // 浏览数 +1（进入详情页调用）
    increaseView(issueId) {
      return new Promise((resolve, reject) => {
        const data = safeRead();
        const idx = (data.issues || []).findIndex((x) => x.issueId === issueId);

        if (idx === -1) {
          reject("该问答不存在");
          return;
        }

        data.issues[idx].scanNumber = (data.issues[idx].scanNumber || 0) + 1;
        writeStorage(data);

        resolve({ scanNumber: data.issues[idx].scanNumber });
      });
    },

    // 新增问答
    create(payload) {
      return new Promise((resolve, reject) => {
        const data = safeRead();

        const { issueTitle, typeId, issueContent, userId } = payload || {};
        if (!issueTitle?.trim()) return reject("请输入标题");
        if (!typeId) return reject("请选择问题分类");
        if (!issueContent?.trim()) return reject("请输入问题描述");
        if (!userId) return reject("请先登录");

        const newIssue = {
          issueId: "i" + Date.now().toString(),
          issueTitle: issueTitle.trim(),
          issueContent: issueContent, // markdown 或 html 都行
          scanNumber: 0,
          commentNumber: 0,
          issueStatus: true,
          issueDate: Date.now().toString(),
          userId: userId,
          typeId: typeId,
        };

        data.issues = Array.isArray(data.issues) ? data.issues : [];
        data.issues.unshift(newIssue); // ✅ 新发布的放最前面（配合 new 排序）
        writeStorage(data);

        resolve({ issueId: newIssue.issueId });
      });
    },
  },
  type: {
    list() {
      return new Promise((resolve) => {
        const data = safeRead();
        resolve({ list: data.types || [] });
      });
    },
  },
  comment: {
    // 获取评论列表（分页）
    list({ issueId, page = 1, pageSize = 5 } = {}) {
      return new Promise((resolve, reject) => {
        const data = safeRead();
        if (!issueId) return reject("缺少 issueId");

        const all = (data.comments || [])
          .filter((c) => String(c.issueId) === String(issueId))
          .sort((a, b) => Number(b.date || 0) - Number(a.date || 0)); // 时间倒序

        const total = all.length;
        const start = (page - 1) * pageSize;
        const pageItems = all.slice(start, start + pageSize);

        // 关联 author（兼容 userId / id）
        const result = pageItems.map((c) => {
          const author = (data.users || []).find(
            (u) => String(u.userId ?? u.id) === String(c.userId)
          );
          return {
            commentId: c.commentId,
            content: c.content,
            date: c.date,
            author: author ? { userId: author.userId ?? author.id, username: author.username } : null,
          };
        });

        resolve({ page, pageSize, total, list: result });
      });
    },

    // 新增评论
    create({ issueId, content, userId } = {}) {
      return new Promise((resolve, reject) => {
        const data = safeRead();
        if (!issueId) return reject("缺少 issueId");
        if (!userId) return reject("请先登录");
        if (!content || !content.trim()) return reject("请输入评论内容");

        const newComment = {
          commentId: "c" + Date.now().toString(),
          issueId: String(issueId),
          userId: String(userId),
          content: content.trim(),
          date: Date.now().toString(),
        };

        data.comments = Array.isArray(data.comments) ? data.comments : [];
        data.comments.unshift(newComment); // 新评论放前面
        writeStorage(data);

        // 同步更新 issue 的 commentNumber（可选，但推荐）
        const idx = (data.issues || []).findIndex((x) => String(x.issueId) === String(issueId));
        if (idx !== -1) {
          data.issues[idx].commentNumber = (data.issues[idx].commentNumber || 0) + 1;
        }

        writeStorage(data);
        resolve({ commentId: newComment.commentId });
      });
    },
  },
  interview: {
    // ======================
    // 分类接口
    // ======================
    category: {
      // 获取树形分类
      tree() {
        return new Promise((resolve) => {
          const data = safeRead();
          resolve({
            list: data.interviewCategories || [],
          });
        });
      },
    },

    // ======================
    // 面试题接口
    // ======================
    question: {

      // 获取列表（分页 + 分类 + 搜索）
      list(params = {}) {
        return new Promise((resolve) => {
          const data = safeRead();
          const {
            page = 1,
            pageSize = 10,
            categoryId,
            keyword,
          } = params;

          let list = Array.isArray(data.interviewQuestions)
            ? [...data.interviewQuestions]
            : [];

          // ===== 分类筛选（包含子分类） =====
          if (categoryId) {
            const ids = collectCategoryIds(
              data.interviewCategories || [],
              categoryId
            );
            list = list.filter((q) => ids.includes(q.categoryId));
          }

          // ===== 关键词搜索 =====
          if (keyword && keyword.trim()) {
            const kw = keyword.trim().toLowerCase();
            list = list.filter((q) => {
              const t = (q.title || "").toLowerCase();
              const c = (q.content || "").toLowerCase();
              return t.includes(kw) || c.includes(kw);
            });
          }

          const total = list.length;

          // ===== 分页 =====
          const start = (page - 1) * pageSize;
          const pageItems = list.slice(start, start + pageSize);

          const result = pageItems.map((q) => ({
            id: q.id,
            title: q.title,
            categoryId: q.categoryId,
            preview: (q.content || "").slice(0, 120),
          }));

          resolve({
            page,
            pageSize,
            total,
            list: result,
          });
        });
      },

      // 获取详情
      detail(id) {
        return new Promise((resolve, reject) => {
          const data = safeRead();
          const q = (data.interviewQuestions || []).find(
            (x) => String(x.id) === String(id)
          );

          if (!q) {
            reject("该题目不存在");
            return;
          }

          resolve(q);
        });
      },

      // 新增题目
      create(payload) {
        return new Promise((resolve, reject) => {
          const data = safeRead();
          const { title, categoryId, content } = payload || {};

          if (!title?.trim()) return reject("请输入标题");
          if (!categoryId) return reject("请选择分类");
          if (!content?.trim()) return reject("请输入内容");

          const newQ = {
            id: "q" + Date.now().toString(),
            title: title.trim(),
            categoryId,
            content,
          };

          data.interviewQuestions = Array.isArray(data.interviewQuestions)
            ? data.interviewQuestions
            : [];

          data.interviewQuestions.unshift(newQ);
          writeStorage(data);

          resolve({ id: newQ.id });
        });
      },
    },
  },
  user: {
    // 更新头像（base64）
    updateAvatar({ userId, avatar }) {
      return new Promise((resolve, reject) => {
        const data = safeRead();
        if (!userId) return reject("缺少 userId");
        if (!avatar) return reject("缺少头像数据");

        const idx = (data.users || []).findIndex((u) => String(u.userId) === String(userId));
        if (idx === -1) return reject("用户不存在");

        data.users[idx].avatar = avatar;
        writeStorage(data);

        // 同步更新当前登录态（localStorage.auth）
        const raw = localStorage.getItem("auth");
        if (raw) {
          try {
            const auth = JSON.parse(raw);
            if (auth?.user?.userId && String(auth.user.userId) === String(userId)) {
              auth.user.avatar = avatar;
              localStorage.setItem("auth", JSON.stringify(auth));
            }
          } catch (_) { }
        }

        resolve({ avatar });
      });
    },
    // 更新昵称
updateProfile({ userId, username }) {
  return new Promise((resolve, reject) => {
    const data = safeRead();
    if (!userId) return reject("缺少 userId");
    if (!username || !username.trim()) return reject("昵称不能为空");

    // 昵称重复检查（可选但推荐）
    const exists = (data.users || []).some(
      (u) => String(u.userId) !== String(userId) && u.username === username.trim()
    );
    if (exists) return reject("昵称已被占用");

    const idx = (data.users || []).findIndex((u) => String(u.userId) === String(userId));
    if (idx === -1) return reject("用户不存在");

    data.users[idx].username = username.trim();
    writeStorage(data);

    // 同步 localStorage.auth
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        if (String(auth?.user?.userId) === String(userId)) {
          auth.user.username = username.trim();
          localStorage.setItem("auth", JSON.stringify(auth));
        }
      } catch (_) {}
    }

    // 返回更新后的 user（给 redux 用）
    resolve({
      user: {
        userId,
        username: username.trim(),
        avatar: data.users[idx].avatar || "",
      },
    });
  });
},

// 修改密码
changePassword({ userId, oldPassword, newPassword }) {
  return new Promise((resolve, reject) => {
    const data = safeRead();
    if (!userId) return reject("缺少 userId");
    if (!oldPassword) return reject("请输入旧密码");
    if (!newPassword || String(newPassword).length < 6) return reject("新密码至少 6 位");

    const idx = (data.users || []).findIndex((u) => String(u.userId) === String(userId));
    if (idx === -1) return reject("用户不存在");

    if (data.users[idx].password !== oldPassword) {
      return reject("旧密码不正确");
    }

    data.users[idx].password = String(newPassword);
    writeStorage(data);

    resolve({ ok: true });
  });
},
  },
  // ======================
// ✅ 书籍接口（持久化）
// ======================
book: {
  // 列表：分页 / 标签筛选 / 关键字搜索
  list(params = {}) {
    return new Promise((resolve) => {
      const data = safeRead();
      const { page = 1, pageSize = 10, typeId, keyword } = params;

      let books = Array.isArray(data.books) ? [...data.books] : [];

      // 标签筛选
      if (typeId) {
        books = books.filter((b) => String(b.typeId) === String(typeId));
      }

      // 关键字搜索（标题）
      if (keyword && keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        books = books.filter((b) => (b.bookTitle || "").toLowerCase().includes(kw));
      }

      // ✅ 正确按日期排序（bookDate 是 "YYYY-MM-DD"）
      books.sort((a, b) => new Date(b.bookDate) - new Date(a.bookDate));

      const total = books.length;

      // 分页
      const start = (page - 1) * pageSize;
      const list = books.slice(start, start + pageSize);

      resolve({ list, total, page, pageSize });
    });
  },

  // 详情：进入详情页 +1 浏览数（并写回 storage）
  detail(bookId) {
    return new Promise((resolve, reject) => {
      const data = safeRead();
      const idx = (data.books || []).findIndex((b) => String(b.bookId) === String(bookId));

      if (idx === -1) {
        reject("书籍不存在");
        return;
      }

      data.books[idx].scanNumber = (data.books[idx].scanNumber || 0) + 1;
      writeStorage(data);

      resolve({ ...data.books[idx] });
    });
  },

  // ✅ 可选：纯读取，不增加浏览数（用于评论后刷新，不想 scanNumber 再+1）
  get(bookId) {
    return new Promise((resolve, reject) => {
      const data = safeRead();
      const book = (data.books || []).find((b) => String(b.bookId) === String(bookId));
      if (!book) return reject("书籍不存在");
      resolve({ ...book });
    });
  },
},

// ======================
// ✅ 书籍评论接口（持久化）
// ======================
bookComment: {
  // 评论列表：按时间倒序
  list(bookId) {
    return new Promise((resolve, reject) => {
      const data = safeRead();
      if (!bookId) return reject("缺少 bookId");

      const comments = (data.bookComments || [])
        .filter((c) => String(c.bookId) === String(bookId))
        .sort((a, b) => Number(b.date || 0) - Number(a.date || 0));

      resolve(comments);
    });
  },

  // 新增评论：写入 storage + 同步更新书籍 commentNumber
  add(payload) {
    return new Promise((resolve, reject) => {
      const data = safeRead();
      const { bookId, userId, content } = payload || {};

      if (!bookId) return reject("缺少 bookId");
      if (!userId) return reject("请先登录");
      if (!content || !content.trim()) return reject("请输入评论内容");

      const newComment = {
        commentId: "bc" + Date.now().toString(),
        bookId: String(bookId),
        userId: String(userId),
        content: content.trim(),
        date: Date.now().toString(),
      };

      data.bookComments = Array.isArray(data.bookComments) ? data.bookComments : [];
      data.bookComments.unshift(newComment);

      // ✅ 同步更新书籍评论数
      const idx = (data.books || []).findIndex((b) => String(b.bookId) === String(bookId));
      if (idx !== -1) {
        data.books[idx].commentNumber = (data.books[idx].commentNumber || 0) + 1;
      }

      writeStorage(data);
      resolve(newComment);
    });
  },

  // ✅ 可选：删除评论（如果你后面要做管理功能）
  remove(commentId) {
    return new Promise((resolve, reject) => {
      const data = safeRead();
      if (!commentId) return reject("缺少 commentId");

      const target = (data.bookComments || []).find((c) => String(c.commentId) === String(commentId));
      if (!target) return reject("评论不存在");

      data.bookComments = (data.bookComments || []).filter((c) => String(c.commentId) !== String(commentId));

      // 同步减少书籍评论数（防止负数）
      const idx = (data.books || []).findIndex((b) => String(b.bookId) === String(target.bookId));
      if (idx !== -1) {
        data.books[idx].commentNumber = Math.max(0, (data.books[idx].commentNumber || 0) - 1);
      }

      writeStorage(data);
      resolve({ ok: true });
    });
  },
},
};

function collectCategoryIds(tree = [], targetId) {
  const findNode = (nodes) => {
    for (const n of nodes) {
      if (n.id === targetId) return n;
      const child = findNode(n.children || []);
      if (child) return child;
    }
    return null;
  };

  const node = findNode(tree);
  if (!node) return [targetId];

  const ids = [];
  const dfs = (n) => {
    ids.push(n.id);
    (n.children || []).forEach(dfs);
  };
  dfs(node);
  return ids;
}
