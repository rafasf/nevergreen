(defproject nevergreen "1.0.0"
  :description "A build monitor with attitude"
  :url "https://github.com/build-canaries/nevergreen"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [ring "1.5.1"]
                 [compojure "1.5.2"]
                 [environ "1.1.0"]
                 [cheshire "5.7.0"]
                 [clj-cctray "0.10.0"]
                 [clj-http "3.4.1"]
                 [ring-curl "0.3.0"]
                 [ring/ring-json "0.4.0"]
                 [ring/ring-defaults "0.2.3"]
                 [bk/ring-gzip "0.2.1"]
                 [ring-basic-authentication "1.0.5"]
                 [base64-clj "0.1.1"]
                 [camel-snake-kebab "0.4.0"]
                 [http-kit "2.2.0"]]
  :plugins [[lein-ring "0.10.0"]]
  :min-lein-version "2.0.0"
  :ring {:handler nevergreen.app/all-routes :port 5000}
  :uberjar-name "nevergreen-standalone.jar"
  :main nevergreen.app
  :aot [nevergreen.app]
  :javac-options ["-Dclojure.compiler.direct-linking=true"]
  :profiles {:dev {:plugins      [[lein-midje "3.2.1"]]
                   :dependencies [[midje "1.8.3"]
                                  [clj-webdriver/clj-webdriver "0.7.2"]
                                  [com.github.detro/phantomjsdriver "1.2.0"]
                                  [ring/ring-mock "0.3.0"]]}})
