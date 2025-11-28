import {View, TouchableOpacity} from 'react-native';

import {scale, ScaledSheet} from 'react-native-size-matters';
import React, {useState} from 'react';
import colors from '../../../../util/colors';
import fonts from '../../../../assets/fonts';
import CustomText from '../../../../common/components/CustomText';

const WeeklyBtn = ({
  leftLabel,
  rightLabel,
  containerStyle,
  leftLabelPress,
  tab,
  setTab,
  rightLabelPress,
}) => {
  // const [tab, setTab] = useState(false);
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      <TouchableOpacity
        onPress={leftLabelPress}
        style={
          tab
            ? [
                styles.secondCont,
                {
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderBottomWidth: 2,
                  borderTopLeftRadius: scale(10),
                  borderBottomLeftRadius: scale(10),
                },
              ]
            : [
                styles.firstCont,
                {borderTopLeftRadius: 10, borderBottomLeftRadius: 10},
              ]
        }>
        <CustomText
          label={leftLabel}
          textStyle={{
            color: tab ? colors.boxColor : colors.white,
            fontFamily: tab ? fonts.regular : fonts.bold,
          }}
          // onPress={leftLabelPress}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={rightLabelPress}
        style={
          tab
            ? [
                styles.firstCont,
                {borderTopRightRadius: 10, borderBottomRightRadius: 10},
              ]
            : [
                styles.secondCont,
                {
                  borderTopWidth: 2,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                },
              ]
        }>
        <CustomText
          label={rightLabel}
          textStyle={{
            color: tab ? colors.white : colors.bocColor,
            fontFamily: tab ? fonts.bold : fonts.regular,
          }}
          // onPress={rightLabelPress}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WeeklyBtn;

const styles = ScaledSheet.create({
  mainContainer: {
    borderRadius: '10@msr',
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    height: '40@vs',
  },
  firstCont: {
    width: '50%',
    height: '100%',
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondCont: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.bocColor,
  },
});
