import com.radar.SearchServlet;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

public class App {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);

        // Configure the WebAppContext
        WebAppContext webAppContext = new WebAppContext();
        webAppContext.setResourceBase("src/main/resources/webapp");
        webAppContext.setContextPath("/");
        webAppContext.setWelcomeFiles(new String[]{"index.html"});

        // Servlet handling /search
        ServletContextHandler servletContextHandler = new ServletContextHandler();
        servletContextHandler.setContextPath("/api");
        servletContextHandler.addServlet(new ServletHolder(new SearchServlet()), "/search");

        server.setHandler(webAppContext);
        server.start();
        server.join();
    }
}
