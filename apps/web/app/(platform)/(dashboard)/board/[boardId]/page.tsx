import BoardIdClient from "./_components/BoardIdClient";

export default function BoardPage({ params }: any) {
  return <BoardIdClient boardId={params.boardId} />;
}
