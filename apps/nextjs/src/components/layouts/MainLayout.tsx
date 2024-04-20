import { type FC, type ReactNode } from "react";

import Footer from "../Footer";
import Navbar from "../Navbar";

interface Props {
  children?: ReactNode;
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div className="inset-0 flex-wrap items-stretch">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
