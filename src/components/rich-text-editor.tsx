'use client';

import { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  dir = 'ltr',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        dir,
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[150px]',
      },
    },
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="border-b bg-muted p-2 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleStrike}
          className={editor.isActive('strike') ? 'bg-muted-foreground/20' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBulletList}
          className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleOrderedList}
          className={editor.isActive('orderedList') ? 'bg-muted-foreground/20' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          className={editor.isActive('blockquote') ? 'bg-muted-foreground/20' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={undo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={redo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}