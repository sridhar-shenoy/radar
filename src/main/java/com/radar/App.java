package com.radar;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class App {
    public static void main(String[] args) throws Exception {
        // Create the Jetty server on port 8080
        Server server = new Server(8080);

        // Create a ServletContextHandler to hold both servlets and static content
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        // Serve static files from the /webapp directory (index.html, JS, CSS)
        ServletHolder staticServletHolder = new ServletHolder("default", DefaultServlet.class);
        staticServletHolder.setInitParameter("resourceBase", App.class.getResource("/webapp").toExternalForm());
        staticServletHolder.setInitParameter("dirAllowed", "true");
        context.addServlet(staticServletHolder, "/");

        // Map the SearchServlet to /api/search
        context.addServlet(new ServletHolder(new SearchServlet()), "/api/search");

        // Set the handler and start the server
        server.setHandler(context);
        server.start();
        server.join();
    }
}
