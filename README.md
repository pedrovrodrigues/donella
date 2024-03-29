# donella
A stock-flow system modelling language application

The project consists of:
  - A brand new structured language, Donella, designed to specify systems in the stock-flow-variable model proposed by Donella Meadows in her book "Thinking in Systems". Its specifications are in the file "specifications.txt";
  - A compiler for said language, in the file "donella.js";
  - A HTML application for using the language, in the file "donella.html", that includes:
    - Input of a code written in Donella;
    - Interface with the compiler;
    - Controls for the stock values, flow rates and variable expressions especified in the compiled code;
    - A start-stop interface that allows the user to simulate the system's behavior over time and manipulate its numbers;
    - A dynamic chart, powered by Google Charts, that tracks the stock values over time;

Update: Drag-and-Drop version
  - In the file "donella-dnd.html", there's a version of the system modelling application that bypasses the need for the language, using a drag-and-drop visual method to generate a system and simulate it.
