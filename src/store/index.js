import { createStore } from "vuex";
import axios from "axios";
const responseFunction = async (question) => {
    const requestData = {
        question: question,
    };
    try {
        const response = await axios.post(
            "http://127.0.0.1:5054/response",
            requestData
        );
        getfileIdentifiant();
        store.dispatch("setfirstTimeUpload", false);
        return response.data;
    } catch (error) {
        console.error("Error occurred:", error);
        return {};
    }
};

const getfileIdentifiant = () => {
    axios.post(
        "http://127.0.0.1:5054/files"
    ).then((response) => {
        store.dispatch('setlabelsName', response.data);
    }).catch((error) => {
        console.error("Error occurred:", error);
        return {}
    });
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
        isUpload: false,
        isChosen: false,
        firstTimeUpload: false,
        isLoad: false,
        labelsName: [],
        history: [],
        sessions: [{
            id: 1,
            user: {
                name: "Chatpdf",
            },
            messages: [],
        },],
        currentSessionId: 1,
        filterKey: "",
        showSidebar: false,
        filesUpload: [],
        description: []
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
        setIsChosen(state, value) {
            state.isChosen = value;
        },
        setIsLoad(state, value) {
            state.isLoad = value;
        },
        setShowSide(state, value) {
            state.showSidebar = value;
        },
        setfirstTimeUpload(state, value) {
            state.firstTimeUpload = value;
        },
        setlabelsName(state, value) {
            state.labelsName = value;
        },
        setHistory(state, value) {
            state.history = value;
        },
        setFilesUpload(state, value) {
            state.filesUpload = value;
        },
        setDescription(state, value) {
            state.description = value;
        },
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
                    content: "Pardon, veuillez importer le fichier PDF.",
                    date: new Date(),
                    self: false,
                });
                return;
            }
            if (content["self_tf"] && isUpload) {
                // session.messages.push({
                //     content: "Pardon je suis en maintenance ! Essaie-moi après.",
                //     date: new Date(),
                //     self: false,
                // });
                session.messages.push({
                    id: this.typingMessageId,
                    content: "En train d'écrire...",
                    isload: true,
                    date: new Date(),
                    self: false,
                });
                const response = responseFunction(content["content"]);

                response.then((r) => {
                    session.messages.pop();
                    session.messages.push({
                        content: r["answer"].length && r["answer"] != "empty" ?
                            r["answer"] : "Pardon , question difficile !",
                        date: new Date(),
                        self: false,
                        id: 1
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
        setIsLoad(context, value) {
            context.commit("setIsLoad", value);
        },
        setShowSide(context, value) {
            context.commit("setShowSide", value);
        },
        setIsChosen(context, value) {
            context.commit("setIsChosen", value);
        },
        setfirstTimeUpload(context, value) {
            context.commit("setfirstTimeUpload", value);
        },
        setlabelsName(context, value) {
            context.commit("setlabelsName", value);
        },
        setHistory(context, value) {
            context.commit("setHistory", value);
        },
        setFilesUpload(context, value) {
            context.commit("setFilesUpload", value);
        },
        setDescription(context, value) {
            context.commit("setDescription", value);
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
        localStorage.setItem("vue-chat-session", JSON.stringify(val));
    }, {
    deep: true,
}
);

store.watch(
    (state) => state.isUpload,
    (val) => {
        localStorage.setItem("isUpload", JSON.stringify(val));
    }, {
    deep: true,
}
);

export default store;