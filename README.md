# donella
A stock-flow system modelling language application

The project consists of: 
  - A brand new structured language, Donella, designed to specify systems in the stock-flow-variable model proposed by Donella Meadows in her book "Thinking in Systems";
  - A compiler for said language, in the file "donella.js";
  - A HTML application for using the language, that includes:
    - Input of a code written in Donella;
    - Interface with the compiler;
    - Controls for the stock values, flow rates and variable expressions especified in the compiled code;
    - A start-stop interface that allows the user to simulate the system's behavior over time and manipulate its numbers;
    - A dynamic chart, powered by Google Charts, that tracks the stock values over time;
