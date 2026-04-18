export const currentUser = {
  id: "user-1",
  email: "dev@example.com",
  name: "Dev User",
};

export const itemTypes = [
  {
    id: "type-snippet",
    name: "Snippet",
    icon: "code",
    color: "#10b981",
    count: 12,
  },
  {
    id: "type-prompt",
    name: "Prompt",
    icon: "message",
    color: "#8b5cf6",
    count: 8,
  },
  {
    id: "type-note",
    name: "Note",
    icon: "file-text",
    color: "#f59e0b",
    count: 5,
  },
  {
    id: "type-command",
    name: "Command",
    icon: "terminal",
    color: "#3b82f6",
    count: 7,
  },
  {
    id: "type-file",
    name: "File",
    icon: "paperclip",
    color: "#6b7280",
    count: 3,
  },
  {
    id: "type-image",
    name: "Image",
    icon: "image",
    color: "#ec4899",
    count: 2,
  },
  { id: "type-link", name: "Link", icon: "link", color: "#14b8a6", count: 6 },
];

export const collections = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 15,
    isFavorite: true,
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
  },
  {
    id: "col-3",
    name: "AI Prompts",
    description: "Prompts for various AI tasks",
    itemCount: 12,
    isFavorite: true,
  },
  {
    id: "col-4",
    name: "Dev Commands",
    description: "Useful terminal commands",
    itemCount: 6,
    isFavorite: false,
  },
];

export const items = [
  {
    id: "item-1",
    title: "useAuth Hook",
    description: "Custom React hook for authentication",
    typeId: "type-snippet",
    language: "typescript",
    content: `export function useAuth() {
  const [user, setUser] = useState(null);
  // ... auth logic
}`,
    isPinned: true,
    isFavorite: true,
    tags: ["react", "auth", "hooks"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "item-2",
    title: "Explain Code Block",
    description: "Prompt to explain code with context",
    typeId: "type-prompt",
    content:
      "Explain this code block in simple terms, focusing on what it does and how it could be improved...",
    isPinned: true,
    isFavorite: false,
    tags: ["explanation", "code-review"],
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "item-3",
    title: "Docker Compose Setup",
    description: "Basic Docker Compose for Node app",
    typeId: "type-command",
    content: `docker-compose up -d
docker-compose logs -f`,
    isPinned: true,
    isFavorite: true,
    tags: ["docker", "devops"],
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "item-4",
    title: "API Response Notes",
    description: "Notes on REST API best practices",
    typeId: "type-note",
    content:
      "- Use proper HTTP status codes\n- Implement pagination\n- Version your APIs",
    isPinned: false,
    isFavorite: false,
    tags: ["api", "rest", "notes"],
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "item-5",
    title: "Next.js Docs",
    description: "Link to Next.js documentation",
    typeId: "type-link",
    url: "https://nextjs.org/docs",
    isPinned: false,
    isFavorite: true,
    tags: ["nextjs", "docs"],
    createdAt: "2024-01-11T11:00:00Z",
    updatedAt: "2024-01-11T11:00:00Z",
  },
];
