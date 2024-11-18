import { createStore } from "vuex";
import { HTTP } from "@/lib/axios";
import auth from './modules/auth.js'

const responseFunction = async (question) => {
    const requestData = {
        question: question,
    };
    try {
        const response = await HTTP.post(
            "/response",
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
    const userData = JSON.parse(localStorage.getItem('user'));
    HTTP.post("/files",{user_id:userData.id})
    .then((response) => {
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
        isLoading: false,
        isLoadUpdate: false,
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
        successAlert: false,
        failedAlert: false,
        showSidebar: true,
        showNewConversation: false,
        chatVide: false,
        filesUpload: [],
        description: [],
        showTrait: false,
        activeComponent: false,
        activeSetDescription: false,
        descriptionSet: false
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
        setSuccessAlert(state, value) {
            state.successAlert = value;
        },
        setActiveSetDescription(state, value) {
            state.activeSetDescription = value;
        },
        setDescriptionSet(state, value) {
            state.descriptionSet = value;
        },
        setFailedAlert(state, value) {
            state.failedAlert = value;
        },
        setChatVide(state, value) {
            state.chatVide = value;
        },
        setIsChosen(state, value) {
            state.isChosen = value;
        },
        setIsLoading(state, value) {
            state.isLoading = value;
        },
        setIsLoadUpdate(state, value) {
            state.isLoadUpdate = value;
        },
        setShowSide(state, value) {
            state.showSidebar = value;
        },
        setShowNewConversation(state, value) {
            state.showNewConversation = value;
        },
        setfirstTimeUpload(state, value) {
            state.firstTimeUpload = value;
        },
        setActiveComponent(state, value) {
            state.activeComponent = value;
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
        setShowTrait(state, value) {
            state.showTrait = value;
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
                    content: "loading",
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
            // localStorage.clear();
            localStorage.setItem("isUpload", false);
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
        setSuccessAlert(context, value) {
            context.commit("setSuccessAlert", value)
        },
        setActiveSetDescription(context, value) {
            context.commit("setActiveSetDescription", value)
        },
        setDescriptionSet(context, value) {
            context.commit("setDescriptionSet", value)
        },
        setFailedAlert(context, value) {
            context.commit("setFailedAlert", value)
        },
        setChatVide(context, value) {
            context.commit("setChatVide", value);
        },
        setActiveComponent(context, value) {
            context.commit("setActiveComponent", value);
        },
        setIsLoading(context, value) {
            context.commit("setIsLoading", value);
        },
        setIsLoadUpdate(context, value) {
            context.commit("setIsLoadUpdate", value);
        },
        setShowSide(context, value) {
            context.commit("setShowSide", value);
        },
        setShowNewConversation(context, value) {
            context.commit("setShowNewConversation", value);
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
        setShowTrait(context, value) {
            context.commit("setShowTrait", value);
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
    modules: {
        auth
      }
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