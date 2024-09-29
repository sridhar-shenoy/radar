import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.google.gson.Gson;

public class Main {
    public static void main(String[] args) throws Exception {
        // Create a Jetty server on port 8080
        Server server = new Server(8080);

        // Create a WebAppContext to serve your web application
        WebAppContext webAppContext = new WebAppContext();
        webAppContext.setContextPath("/");
        webAppContext.setResourceBase(Main.class.getResource("/webapp").toExternalForm()); // Use your resource folder
        webAppContext.setInitParameter("org.eclipse.jetty.servlet.Default.dirAllowed", "false");

        // Add the SearchServlet
        webAppContext.addServlet(new ServletHolder(new SearchServlet()), "/search");

        server.setHandler(webAppContext);

        // Start the server
        server.start();
        server.join();
    }
}

class SearchServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String complianceId = req.getParameter("ComplianceId");
        // Mock response data based on complianceId
        ResponseData responseData = new ResponseData(complianceId, new String[]{"Tab1", "Tab2"}, new String[][]{
                {"Summary 1", "Detail 1.1", "Detail 1.2"},
                {"Summary 2", "Detail 2.1", "Detail 2.2"}
        });
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(gson.toJson(responseData));
    }
}

class ResponseData {
    private String complianceId;
    private String[] tabs;
    private String[][] data;

    public ResponseData(String complianceId, String[] tabs, String[][] data) {
        this.complianceId = complianceId;
        this.tabs = tabs;
        this.data = data;
    }
}
