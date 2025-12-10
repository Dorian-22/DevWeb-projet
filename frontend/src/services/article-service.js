import api from "./api";

export const getArticles = async () => {
  const response = await api("http://localhost:3000/articles");
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Failed to api articles");
};
export const createArticle = async (values) => {
  const response = await api("http://localhost:3000/articles", {
    method: "POST",
    body: values,
  });
  if (response.ok) {
    return await response.json();
  } else if (response.status === 401) {
    throw new Error("Unauthorized");
  } else if (response.status === 422) {
    throw new Error(await response.json());
  }
};
export const updateArticle = async (id, values) => {
  const response = await api(`http://localhost:3000/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (response.ok) {
    return await response.json();
  } else if (response.status === 401) {
    throw new Error("Unauthorized");
  } else if (response.status === 422) {
    throw new Error(await response.json());
  }
};
export const deleteArticle = async (id) => {
  const response = await api(`http://localhost:3000/articles/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return;
  } else if (response.status === 401) {
    throw new Error("Unauthorized");
  }
};