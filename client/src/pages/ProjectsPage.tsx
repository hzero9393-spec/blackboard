import { useNavigate } from 'react-router-dom';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-board p-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Visual Web Builder</h1>
        <p className="mt-2 text-zinc-400">Projects dashboard (Turso + Vercel ready)</p>
        <button
          onClick={() => navigate(`/editor/${crypto.randomUUID()}`)}
          className="mt-6 rounded bg-blue-600 px-4 py-2"
        >
          Create Project
        </button>
      </div>
    </div>
  );
};
