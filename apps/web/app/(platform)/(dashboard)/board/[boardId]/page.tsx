import BoardIdClient from "./_components/BoardIdClient";

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardIdPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  return <BoardIdClient boardId={boardId} />;
}
