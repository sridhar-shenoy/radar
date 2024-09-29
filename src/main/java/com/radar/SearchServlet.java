package com.radar;

import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class SearchServlet extends HttpServlet {
    private static final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String complianceId = req.getParameter("complianceId");

        // Create a sample response
        Map<String, Object> result = new HashMap<>();
        result.put("Analysis", "Sample Analysis Data for " + complianceId);
        result.put("Actions", new String[][]{
                {"Summary 1", "Log Details 1"},
                {"Summary 2", "Log Details 2"}
        });
        result.put("Locates", "Sample Locate Data");

        // Set response content type
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Write JSON response using Gson
        resp.getWriter().write(gson.toJson(result));
    }
}
