package com.radar;

import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SearchServlet extends HttpServlet {
    private static final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String complianceId = req.getParameter("complianceId");

        // Sample data based on complianceId
        List<Map<String, Object>> actions = new ArrayList<>();
        actions.add(createAction("batman", "25-10-24 10:10:10", "Log Details 1", "success"));
        actions.add(createAction("blackbird", "25-10-24 10:20:10", "Log Details 2", "error"));
        actions.add(createAction("batman", "25-10-24 10:30:10", "Log Details 3", "warning"));

        Map<String, Object> result = new HashMap<>();
        result.put("Analysis", "Sample Analysis Data for " + complianceId);
        result.put("Actions", actions);
        result.put("Locates", "Sample Locate Data");

        // Set response content type
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Write JSON response using Gson
        resp.getWriter().write(gson.toJson(result));
    }

    private Map<String, Object> createAction(String system, String date, String log, String type) {
        Map<String, Object> action = new HashMap<>();
        action.put("system", system);
        action.put("date", date);
        action.put("log", log);
        action.put("type", type);
        return action;
    }
}
