<%@page import="java.io.Writer"%>
<%@ page session="true" language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>

<%@page import="vo.TwitterClient"%> 
<%@page import="twitter4j.auth.AccessToken"%>
<%@page import="twitter4j.auth.RequestToken"%>

<%
// twitter에서 넘겨줌
String oauth_token = request.getParameter("oauth_token");

// signin.jsp에서 저장한 것들
RequestToken token = (RequestToken)session.getAttribute("requestToken");
TwitterClient tw = (TwitterClient)session.getAttribute("tw");

String title = (String)session.getAttribute("title");
String context = (String)session.getAttribute("context");
String url = (String)session.getAttribute("url");

String requestText = title +"  "+ context +"  "+ url;

tw.getAccessToken(oauth_token, token);
tw.setTwitter(requestText);
%>

<script type="text/javascript">
window.close();
</script>
</body>
</html>
