import { DataGrid } from "../component/data-grid";
import sampleData from "../sample-applications.json"; // Adjust the path as necessary

const data = sampleData.map(item => ({
  id: item.id,
  userId: item.userId,
  jobId: item.jobId,
  name: item.name,
  email: item.email,
  phone: item.phone,
  location: item.location,
  ctc: item.ctc,
  employer: item.employer,
  currentContractType: item.currentContractType,
  currentWorkType: item.currentWorkType,
  preferredWorkType: item.preferredWorkType,
}));

const columns = [
  { id: "id", header: "ID", accessorKey: "id" },
  { id: "userId", header: "User ID", accessorKey: "userId" },
  { id: "jobId", header: "Job ID", accessorKey: "jobId" },
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "phone", header: "Phone", accessorKey: "phone" },
  { id: "location", header: "Location", accessorKey: "location" },
  { id: "currentWorkType", header: "Work Type", accessorKey: "currentWorkType" },
  { id: "preferredWorkType", header: "Preferred Work Type", accessorKey: "preferredWorkType" },
];

export default function Home() {
  return (
    <div className="container py-10">
      <DataGrid data={data} columns={columns} />
    </div>
  );
}