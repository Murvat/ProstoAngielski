export const ProfileUserData = ({ id, email }: { id: string; email?: string }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Dane osobiste</h2>
    <p className="text-gray-700">Email: {email}</p>
    <p className="text-gray-700 mt-2">ID użytkownika: {id}</p>
  </div>
);
