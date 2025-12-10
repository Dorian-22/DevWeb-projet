import { useEffect, useState } from "react";
import Button from "../../components/button";
import ArticleItem from "./item";
import { createArticle, getArticles } from "../../services/article-service";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then((data) => setArticles(data));
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    const values = {
      title: event.target.title.value,
      content: event.target.content.value,
    };

    const data = await createArticle(values);
    setArticles((prev) => [...prev, data]);
    event.target.reset();
  };

  return (
    <div>
      <h3>Create Article</h3>
      <form onSubmit={handleCreate}>
        <input placeholder="Title" name="title" />
        <textarea placeholder="Content" name="content" />
        <Button title="Créer" type="submit" />
      </form>
      <h2>Mes articles ({articles.length})</h2>
      {articles.map((item) => (
        <ArticleItem key={item.id} article={item} setArticles={setArticles} />
      ))}
      {articles.length === 0 && <p>Aucun article</p>}
    </div>
  );
}