import { createStore } from "vuex";
import axios from "axios";

const responseFunction = async(question) => {

    const requestData = {
        question: question,
        hash_value: localStorage.getItem("hashValue"),
    };
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            requestData
        );
        return response.data; // Assuming your FastAPI endpoint returns data
    } catch (error) {
        console.error("Error occurred:", error);
        return {};
    }
};

const response_ = {
    content: `
        Un accident est défini comme une blessure non intentionnelle résultant d'une C
        cause extérieure soudaine, violente et imprévisible, et qui peut mettre en
        danger la vie de la personne touchée ou entraîner une détérioration significative
        de son état si des soins appropriés ne sont pas prodigués rapidement. Dans le
        contexte des véhicules, un accident peut inclure une collision, un choc contre un
        objet fixe ou mobile, un renversement, un incendie. une explosion, ou toute
        action des forces naturelles rendant impossible l'utilisation normale et sécurisée
        du véhicule conformément au Code de la route ou à d'autres réglementations en
        vigueur.
        `,
};
// Create a new store instance.
const store = createStore({
    state: {
        //
        isUpload: false,
        //
        sessions: [{
            id: 1,
            user: {
                name: "Chatpdf",
            },
            messages: [],
        }, ],
        //
        currentSessionId: 1,
        //
        filterKey: "",
    },
    mutations: {
        INIT_DATA(state) {
            let data = localStorage.getItem("vue-chat-session");
            if (data) {
                state.sessions = JSON.parse(data);
            }
            let isUploadStorage = localStorage.getItem("isUpload");
            if (isUploadStorage) {
                state.isUpload = Boolean(JSON.parse(isUploadStorage));
            }
        },
        setIsUpload(state, value) {
            state.isUpload = value;
        },
        //
        SEND_MESSAGE({ sessions, currentSessionId, isUpload }, content, self_tf) {
            let session = sessions.find((item) => item.id === currentSessionId);
            session.messages.push({
                content: content["content"],
                date: new Date(),
                self: content["self_tf"],
            });
            // dummy answer
            if (content["content"] == "c'est quoi un accident ?") {
                session.messages.push({
                    content: response_.content,
                    date: new Date(),
                    self: false,
                });
                return;
            }
            // add answer
            if (!isUpload) {
                session.messages.push({
                    content: "Pardon veuillez importer le fichier PDF !",
                    date: new Date(),
                    self: false,
                });
                return;
            }
            if (content["self_tf"] && isUpload) {

                const response = responseFunction(content["content"]);
                response.then((r) => {
                    // console.log(r["answer"]);
                    session.messages.push({
                        content: r["answer"].length && r["answer"] != "empty" ?
                            r["answer"] : "Pardon , question difficile !",
                        date: new Date(),
                        self: false,
                    });
                });
            }
        },
        RESTART({ sessions, currentSessionId, isUpload }) {
            let session = sessions.find((item) => item.id === currentSessionId);
            //clear localStorage
            localStorage.clear();
            session.messages = [];
        },
        //
        SELECT_SESSION(state, id) {
            state.currentSessionId = id;
        },
        //
        SET_FILTER_KEY(state, value) {
            state.filterKey = value;
        },
    },
    actions: {
        initData(context) {
            context.commit("INIT_DATA");
        },
        sendMessage(context, content, self_tf) {
            context.commit("SEND_MESSAGE", content, self_tf);
        },
        setIsUpload(context, value) {
            context.commit("setIsUpload", value);
        },
        restart(context) {
            context.commit("RESTART");
        },
        selectSession(context, id) {
            context.commit("SELECT_SESSION", id);
        },
        search(context, value) {
            context.commit("SET_FILTER_KEY", value);
        },
    },
});

store.watch(
    (state) => state.sessions,
    (val) => {
        // console.log("CHANGE: ", val);
        localStorage.setItem("vue-chat-session", JSON.stringify(val));
    }, {
        deep: true,
    }
);

store.watch(
    (state) => state.isUpload,
    (val) => {
        // console.log("isUpload ", val);
        localStorage.setItem("isUpload", JSON.stringify(val));
    }, {
        deep: true,
    }
);

export default store;