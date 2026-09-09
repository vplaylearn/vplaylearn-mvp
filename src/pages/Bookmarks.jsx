import { useState } from "react";
import { getBookmarks, removeBookmark } from "../utils/bookmarks";
import "./bookmarks.css";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [activeType, setActiveType] = useState("Daily word");
  const [activeLanguage, setActiveLanguage] = useState("all");
  const groups = [
    { type: "Daily word", title: "Words of the Day" },
    { type: "Searched word", title: "Searched Words" },
    { type: "Idiom / phrase", title: "Idioms and Phrases" },
  ];
  const activeGroup = groups.find((group) => group.type === activeType) || groups[0];
  const typeBookmarks = bookmarks.filter((bookmark) => bookmark.type === activeType);
  const languages = [
    "all",
    ...new Set(typeBookmarks.map((bookmark) => bookmark.language).filter(Boolean)),
  ];
  const activeBookmarks = typeBookmarks.filter(
    (bookmark) => activeLanguage === "all" || bookmark.language === activeLanguage
  );

  function handleRemove(id) {
    removeBookmark(id);
    setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id));
  }

  return (
    <section className="bookmarks-page" aria-labelledby="bookmarks-title">
      <header className="bookmarks-header">
        <div>
          <p className="bookmarks-eyebrow">Your saved learning</p>
          <h1 id="bookmarks-title">Bookmarks</h1>
          <p>Keep useful words, searches, and idioms close for revision.</p>
        </div>
        <strong>{bookmarks.length} saved</strong>
      </header>

      {bookmarks.length === 0 ? (
        <div className="bookmarks-empty">
          <span aria-hidden="true">☆</span>
          <h2>No bookmarks yet</h2>
          <p>Use the bookmark button on a word, search result, or idiom to save it here.</p>
        </div>
      ) : (
        <div className="bookmarks-content">
          <div className="bookmark-tabs" role="tablist" aria-label="Bookmark categories">
            {groups.map((group) => {
              const count = bookmarks.filter((bookmark) => bookmark.type === group.type).length;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeType === group.type}
                  className={activeType === group.type ? "active" : ""}
                  onClick={() => {
                    setActiveType(group.type);
                    setActiveLanguage("all");
                  }}
                  key={group.type}
                >
                  {group.title} <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="bookmark-language-tabs" role="tablist" aria-label={`${activeGroup.title} languages`}>
            {languages.map((language) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeLanguage === language}
                className={activeLanguage === language ? "active" : ""}
                onClick={() => setActiveLanguage(language)}
                key={language}
              >
                {language === "all" ? "All languages" : language}
              </button>
            ))}
          </div>

          {activeBookmarks.length === 0 ? (
            <div className="bookmarks-empty bookmark-tab-empty">
              <span aria-hidden="true">☆</span>
              <h2>No {activeGroup.title.toLowerCase()} saved</h2>
              <p>Bookmark an item from this category and it will appear here.</p>
            </div>
          ) : (
            <div className="bookmarks-list">
              {activeBookmarks.map((bookmark) => (
                <article className="bookmark-item" key={bookmark.id}>
                  <div>
                    <div className="bookmark-meta">
                      <span>{bookmark.type}</span>
                      {bookmark.language && <span>{bookmark.language}</span>}
                    </div>
                    <h3>{bookmark.title}</h3>
                    {bookmark.subtitle && <p className="bookmark-subtitle">{bookmark.subtitle}</p>}
                    <p>{bookmark.description}</p>
                  </div>
                  <button type="button" onClick={() => handleRemove(bookmark.id)} aria-label={`Remove ${bookmark.title}`}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
