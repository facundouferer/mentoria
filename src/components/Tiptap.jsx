// components/TiptapEditor.jsx
"use client";
import "./TiptapStyles.scss";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

export default function TiptapEditor({ content, onChange }) {
  const hasSetContent = useRef(false); // track if we've already set content

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && !hasSetContent.current) {
      editor.commands.setContent(content);
      hasSetContent.current = true;
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("bold") ? "is-active" : ""
              }`}
            >
              <b>B</b>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("italic") ? "is-active" : ""
              }`}
            >
              <i>I</i>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("strike") ? "is-active" : ""
              }`}
            >
              <s>ab</s>
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }`}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }`}
            >
              H2
            </button>
            {/* <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              H3
            </button>  */}
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                editor.isActive("bulletList") ? "is-active" : ""
              }`}
            >
              Viñetas
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
