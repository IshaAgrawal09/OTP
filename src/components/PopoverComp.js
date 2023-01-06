import {
  Alert,
  FlexChild,
  FlexLayout,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React from "react";

const PopoverComp = (data, pathData) => {
  return (
    <div>
      <FlexLayout spacing="tight" direction="vertical">
        <FlexChild spacing="tight" wrap="noWrap" halign="fill">
          <TextStyles fontweight="bold">Size :</TextStyles>
          <TextStyles textcolor="light">
            {data.audience_size_lower_bound} -{data.audience_size_upper_bound}
          </TextStyles>
        </FlexChild>
        <FlexChild spacing="tight" wrap="noWrap">
          <TextStyles fontweight="bold">Interests : </TextStyles>
          <TextStyles textcolor="light">{pathData}</TextStyles>
        </FlexChild>
        <FlexChild>
          {data.description && (
            <>
              <TextStyles fontweight="bold">Description:</TextStyles>
              <TextStyles textcolor="light">{data.description}</TextStyles>
            </>
          )}
        </FlexChild>
        <FlexChild>
          <Alert type="info" destroy={false}>
            The audience size for the selected interest group is shown as a
            range. These numbers are subject to change over time.
          </Alert>
        </FlexChild>
      </FlexLayout>
    </div>
  );
};

export default PopoverComp;
