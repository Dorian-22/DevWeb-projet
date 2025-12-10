import { useState } from "react";
import Button from "../../components/button";
import { deleteArticle, updateArticle } from "../../services/article-service";

export default function ArticleItem({ article, setArticles }) {
  const [editMode, setEditMode] = useState(false);

  const handleDelete = async () => {
    await deleteArticle(article.id);
    setArticles((prev) => prev.filter((item) => item.id !== article.id));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const values = {
      title: event.target.title.value,
      content: event.target.content.value,
    };

    const data = await updateArticle(article.id, values);
    setArticles((prev) =>
      prev.map((item) => (item.id === data.id ? data : item))
    );
    setEditMode(false);
  };

  return (
    <>
      <div key={article.id}>
        <span>{article.title}</span>
        <span style={{ marginLeft: 5 }}>{article.content}</span>
        <span style={{ marginLeft: 5 }}>{article.status}</span>
        <Button title="V" onClick={() => setEditMode((prev) => !prev)} />
        <Button
          style={{ backgroundColor: "red", color: "white" }}
          title="X"
          onClick={handleDelete}
        />
      </div>
      {editMode && (
        <form onSubmit={handleUpdate}>
          <input name="title" defaultValue={article.title} />
          <textarea name="content" defaultValue={article.content}></textarea>
          <Button title="Mettre à jour" type="submit" />
        </form>
      )}
    </>
  );
}