import React from "react";
import {
  Cover,
  Container,
  Field,
  Description,
  StyledLink
} from "../components/Atoms";

const ErrorPage = ({ match, history }) => (
  <Container>
    <Field>
      <Cover src="./500.png" />
      <Description>
        <StyledLink to="" onClick={() => history.goBack()}>
          返回上一頁
        </StyledLink>, 或者 <StyledLink to="/">返回首頁</StyledLink>.
      </Description>
    </Field>
  </Container>
);

export default ErrorPage;
