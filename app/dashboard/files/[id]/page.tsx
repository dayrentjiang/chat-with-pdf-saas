async function chatToFilePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <div>chatToFilePage: {id}</div>;
}

export default chatToFilePage;
