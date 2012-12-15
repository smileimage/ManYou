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
<%@page import="twitter4j.auth.RequestToken"%>
<%
TwitterClient tw = new TwitterClient();

RequestToken token = tw.getRequestToken();
String authUrl = token.getAuthorizationURL();

String title = "[ " + request.getParameter("title") + " ]";
String context = request.getParameter("context");
String url = request.getParameter("url");

session.setAttribute("requestToken", token);
session.setAttribute("tw", tw);

session.setAttribute("title", title);
session.setAttribute("context", context);
session.setAttribute("url", url);

%>

<script>
location.href = "<%=authUrl%>";
</script>

</body>
</html>