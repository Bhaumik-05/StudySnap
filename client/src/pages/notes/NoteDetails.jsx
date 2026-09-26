import { useParams } from "react-router-dom";

function NoteDetails() {
  const { noteId } = useParams();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Note Details
      </h1>

      <p className="mt-4">
        Note ID: {noteId}
      </p>
    </main>
  );
}

export default NoteDetails;