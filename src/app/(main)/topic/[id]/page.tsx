import { FC } from "react";

interface Props {
  params: {
    id: string;
  };
}
const page: FC<Props> = async ({ params }) => {
  return (
    <div className=" container my-10">
      Hello
    </div>
  );
};

export default page;
