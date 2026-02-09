import { assign, createActor, createMachine } from "xstate";

const counter = {
  count: 0,
};

// State machine
const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  context: counter,
  states: {
    inactive: {
      on: {
        TOGGLE: { target: "active" },
      },
    },
    active: {
      on: {
        INC: { actions: assign({ count: ({ context }) => context.count + 1 }) },
        END: { target: "inactive" },
      },
    },
  },
});

const toggleActor = createActor(toggleMachine);
const sp = toggleActor.getSnapshot();
type Snapshot = typeof sp;

const printer = (sp: Snapshot) => {
  console.log(sp.value, sp.context.count);
};

toggleActor.start();

printer(toggleActor.getSnapshot());
toggleActor.send({ type: "TOGGLE" });
printer(toggleActor.getSnapshot());

for (let i = 0; i < 10; i++) {
  toggleActor.send({ type: "INC" });
  printer(toggleActor.getSnapshot());
}

toggleActor.send({ type: "END" });
printer(toggleActor.getSnapshot());
