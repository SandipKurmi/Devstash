export const currentUser = {
  id: "user-1",
  email: "john@example.com",
  name: "John Doe",
};

export const itemTypes = [
  {
    id: "type-snippet",
    name: "Snippet",
    pluralName: "Snippets",
    icon: "code",
    color: "#10b981",
    count: 24,
  },
  {
    id: "type-prompt",
    name: "Prompt",
    pluralName: "Prompts",
    icon: "message",
    color: "#8b5cf6",
    count: 18,
  },
  {
    id: "type-command",
    name: "Command",
    pluralName: "Commands",
    icon: "terminal",
    color: "#3b82f6",
    count: 15,
  },
  {
    id: "type-note",
    name: "Note",
    pluralName: "Notes",
    icon: "file-text",
    color: "#f59e0b",
    count: 12,
  },
  {
    id: "type-file",
    name: "File",
    pluralName: "Files",
    icon: "paperclip",
    color: "#6b7280",
    count: 5,
  },
  {
    id: "type-image",
    name: "Image",
    pluralName: "Images",
    icon: "image",
    color: "#ec4899",
    count: 3,
  },
  {
    id: "type-link",
    name: "Link",
    pluralName: "Links",
    icon: "link",
    color: "#14b8a6",
    count: 8,
  },
];

export const collections = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    isFavorite: true,
    typeIcons: ["code", "file-text"],
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
    typeIcons: ["code"],
  },
  {
    id: "col-3",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    isFavorite: true,
    typeIcons: ["paperclip", "file-text"],
  },
  {
    id: "col-4",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    isFavorite: true,
    typeIcons: ["terminal"],
  },
  {
    id: "col-5",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    isFavorite: false,
    typeIcons: ["file-text", "code"],
  },
  {
    id: "col-6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    isFavorite: false,
    typeIcons: ["message"],
  },
];

export const items = [
  {
    id: "item-1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "type-snippet",
    language: "typescript",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    isPinned: true,
    isFavorite: true,
    tags: ["react", "auth", "hooks"],
    collectionId: "col-1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "item-2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "type-snippet",
    language: "typescript",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  // exponential backoff implementation
}`,
    isPinned: true,
    isFavorite: false,
    tags: ["api", "error-handling", "fetch"],
    collectionId: null,
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
  },
  {
    id: "item-3",
    title: "Explain Code Block",
    description: "Prompt to explain code with context",
    typeId: "type-prompt",
    content:
      "Explain this code block in simple terms, focusing on what it does and how it could be improved...",
    isPinned: false,
    isFavorite: false,
    tags: ["explanation", "code-review"],
    collectionId: "col-6",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "item-4",
    title: "Docker Compose Setup",
    description: "Basic Docker Compose for Node app",
    typeId: "type-command",
    content: `docker-compose up -d\ndocker-compose logs -f`,
    isPinned: false,
    isFavorite: true,
    tags: ["docker", "devops"],
    collectionId: "col-4",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
];
