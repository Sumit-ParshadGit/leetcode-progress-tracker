document.addEventListener("DOMContentLoaded", function () {
    const stats = document.getElementById("stats");
    const statsCard = document.getElementById("stats-card");

    const searchButton = document.getElementById("search");
    const usernameInput = document.getElementById("uid");

    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-container");
    const mediumProgressCircle = document.querySelector(".medium-container");
    const hardProgressCircle = document.querySelector(".hard-container");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUserName(name) {
        if (name.trim() === "") {
            alert("Username shouldn't be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,20}$/;

        if (!regex.test(name)) {
            alert("Invalid username");
            return false;
        }

        return true;
    }

    async function fetchUserDetails(username) {

        const url = `https://leetcode-stats-api.vercel.app/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const parsedData = await response.json();

            if (parsedData.errors) {
                throw new Error(parsedData.errors[0].message);
            }

            console.log(parsedData);
            return parsedData;

        } catch(error){
            console.error(error);
            alert(error.message);
            return null;
        }finally {
            searchButton.textContent = "See Progress";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {

        const progressDegree = (solved / total) * 100;

        circle.style.setProperty("--progress-degree", `${progressDegree}%`);

        label.textContent = `${solved}/${total}`;
    }

    function displayData(parsedData) {

        const totalQuestions = parsedData.totalQuestions;
        const totalSolved = parsedData.totalSubmissions[0].count;

        const totalEasy = parsedData.totalEasy;
        const easySolved = parsedData.easySolved;

        const totalMedium = parsedData.totalMedium;
        const mediumSolved = parsedData.mediumSolved;

        const totalHard = parsedData.totalHard;
        const hardSolved = parsedData.hardSolved;
        document.getElementById("easySolvedCard").textContent = easySolved;
        document.getElementById("easySubmissionCard").textContent = parsedData.totalSubmissions[1].submissions;

        document.getElementById("mediumSolvedCard").textContent = mediumSolved;
        document.getElementById("mediumSubmissionCard").textContent = parsedData.totalSubmissions[2].submissions;

        document.getElementById("hardSolvedCard").textContent = hardSolved;
        document.getElementById("hardSubmissionCard").textContent = parsedData.totalSubmissions[3].submissions;

        document.getElementById("totalSolvedCard").textContent = 
        parsedData.totalSolved;
        
        document.getElementById("totalQuestionCard").textContent = totalQuestions;
        document.getElementById("totalSubmissionCard").textContent = parsedData.totalSubmission[0].submissions;
        updateProgress(
            easySolved,
            totalEasy,
            easyLabel,
            easyProgressCircle
        );

        updateProgress(
            mediumSolved,
            totalMedium,
            mediumLabel,
            mediumProgressCircle
        );

        updateProgress(
            hardSolved,
            totalHard,
            hardLabel,
            hardProgressCircle
        );

        console.log(`Solved ${totalSolved} out of ${totalQuestions}`);
    }

    searchButton.addEventListener("click", async function () {

    const username = usernameInput.value.trim();

    if (!validateUserName(username)) return;

    const newData = await fetchUserDetails(username);

    if (!newData) return;

    displayData(newData);

    stats.classList.remove("hidden");
    statsCard.classList.remove("hidden");
});

});