declare module "*.png";

declare module "*.svg" {
  import {StyleProp, ViewStyle} from "react-native";

  type ImageProps = {
    height?: string | number;
    width?: string | number;
    fill?: string;

    style?: StyleProp<ViewStyle>;
  };
  declare class Image extends React.Component<ImageProps> {}

  export default Image;
}

declare module "react-native-user-agent" {
  declare class UserAgent {
    static getUserAgent(): string;
    static getWebViewUserAgent(): string;
  }

  export default UserAgent;
}
