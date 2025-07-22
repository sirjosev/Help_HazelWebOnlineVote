document.getElementById('voteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Logic for submitting vote
    console.log('Vote form submitted');
    const selectedCandidate = document.getElementById('candidate').value;
    console.log('Selected Candidate:', selectedCandidate);
    // Here you would typically send the vote to a server
    alert(`You voted for: ${selectedCandidate}! Your vote has been recorded.`);
    // After voting, you might want to redirect to the dashboard or results page
    // window.location.href = 'dashboard.html';
    
});
