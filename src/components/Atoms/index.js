import styled from "styled-components";
import Icon from "antd/lib/icon";
import { Link } from "react-router-dom";

/**
 * Buttons
 */
const IconButton = styled(Icon)`
  font-size: 25px;
  color: #ddd;
  width: 50px;
  display: inline-block;
  height: 50px;
`;

/**
 * Images
 */

const Cover = styled.img`
	margin: 0 auto;
	width: 100%;
`;

/**
 * Layouts
 */

const Container = styled.div`
	position: relative;
	text-align: center;
	height: calc(100vh - 40px);
	::after {
		content: '';
		height: 100%;
		width: 0;
		display: inline-block;
		vertical-align: middle;
	}
`;

const Field = styled.div`
	width: 50%;
	margin: 0 auto;
	display: inline-block;
	vertical-align: middle;
`;

/**
 * Links
 */
const StyledLink = styled(Link)`
	color: #f5a623;
	:hover {
		color: #009688;
	}
`;

const ThemeLink = styled(Link)`
  color: #fff;
  &:hover {
    color: #fc1;
  }
`;

/**
 * Texts
 */

const Description = styled.p`
	font-size: 1em;
	color: #333;
	margin-top: 3em;
`;

const Topic = styled.h1`
  color: #345;
  font-size: 24px;
`;

const SiteTitle = styled.h1`
  color: #ddd;
  display: inline-block;
  margin: 0 auto;
  width: calc(100% - 100px);
  height: 100%;
  text-align: center;
`;

export {
  Description,
  Topic,
  SiteTitle,
  StyledLink,
  ThemeLink,
  Container,
  Field,
  IconButton,
  Cover
};
