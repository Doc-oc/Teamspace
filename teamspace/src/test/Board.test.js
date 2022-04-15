import React from "react";
import { shallow, mount } from "enzyme";
import App from "../components/App";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";


configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  shallow(<Board />);
});



