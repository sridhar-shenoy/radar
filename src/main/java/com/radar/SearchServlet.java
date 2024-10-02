    package com.radar;

    import javax.servlet.ServletException;
    import javax.servlet.annotation.WebServlet;
    import javax.servlet.http.HttpServlet;
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    import com.google.gson.Gson;
    import java.io.IOException;
    import java.io.PrintWriter;
    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.concurrent.TimeUnit;

    @WebServlet("/api/search")
        public class SearchServlet extends HttpServlet {

        @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            // Set response content type to JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // Parse the request body to get the compliance ID
            String complianceId = new Gson().fromJson(request.getReader(), Map.class).get("complianceId").toString();

            // Replace this block with your actual logic for fetching the logs
            // For now, we will return some mock data
            Map<String, Object> result = new HashMap<>();
            result.put("actions", getDummyActionsLogs(complianceId));
            result.put("analysis", getDummyAnalysisLogs(complianceId));

            // Convert the result to JSON and write it back to the response
            PrintWriter out = response.getWriter();
            String jsonResponse = new Gson().toJson(result);
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            out.print(jsonResponse);
            out.flush();
        }

        // Dummy data for Actions logs
        // Dummy data for Actions logs
        private List<Map<String, Object>> getDummyActionsLogs(String complianceId) {
            List<Map<String, Object>> logs = new ArrayList<>();

            for (int i = 1; i <= 100; i++) {
                Map<String, Object> log = new HashMap<>();
                log.put("system", "System " + (char) ('A' + (i % 4))); // Rotate between A, B, C, D
                log.put("date", "12/09/2024 13:4" + (i % 10) + "0:" + (i % 60));
                log.put("summary", "This is Summary " + i);
                log.put("log", i % 2 == 0 ? "green" : "red"); // Alternate log colors

                // Detailed table with key-value pairs
                Map<String, String> details = new HashMap<>();
                for (int j = 1; j <= 20; j++) {
                    details.put("Detail Key " + j, "Detail Value " + j + " for Log " + i);
                }
                log.put("details", details);
                logs.add(log);
            }

            return logs;
        }

        // Dummy data for Analysis logs
        private List<Map<String, Object>> getDummyAnalysisLogs(String complianceId) {
            List<Map<String, Object>> logs = new ArrayList<>();

            for (int i = 1; i <= 100; i++) {
                Map<String, Object> log = new HashMap<>();
                log.put("system", "System " + (char) ('E' + (i % 4))); // Rotate between E, F, G, H
                log.put("date", "12/09/2024 14:0" + (i % 10) + ":" + (i % 60));
                log.put("summary", "This is Summary " + (100 + i));
                log.put("log", i % 2 == 0 ? "yellow" : "blue"); // Alternate log colors

                // Detailed table with key-value pairs
                Map<String, String> details = new HashMap<>();
                for (int j = 1; j <= 20; j++) {
                    details.put("Detail Key " + j, "Detail Value " + j + " for Analysis Log " + i);
                }
                log.put("details", details);
                logs.add(log);
            }

            return logs;
        }
    }
