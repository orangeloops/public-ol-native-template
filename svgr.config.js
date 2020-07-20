module.exports = {
  replaceAttrValues: {
    currentColor: '{props.color || require("react-native").StyleSheet.flatten(props.style || {}).color}',
  },
};
