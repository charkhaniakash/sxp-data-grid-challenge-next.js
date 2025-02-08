import { DataGrid } from "../components/data-grid"

const data = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? "Admin" : "User"
}));
const columns = [
  { id: "id", header: "ID", accessorKey: "id" },
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "role", header: "Role", accessorKey: "role" },
]

export default function Home() {
  return (
    <div className="container py-10">
      <DataGrid data={data} columns={columns} />
    </div>
  )
}

