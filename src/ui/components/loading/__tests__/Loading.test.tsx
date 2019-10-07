import * as React from "react";
import renderer from "react-test-renderer";

import {Loading} from "../Loading";

describe("Loading", () => {
  test("Renders without errors", () => {
    expect(renderer.create(<Loading isVisible={true} />).toJSON()).toMatchSnapshot();
  });
});
