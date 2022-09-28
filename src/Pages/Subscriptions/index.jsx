import { useSelector } from "react-redux";
import SearchBar from "../../Components/SearchBar";

const Subscriptions = () => {
	const userProfile = useSelector((state) => state.user.userProfile);

	return (
		<div className="container-fluid">
			<SearchBar user={userProfile} />
			<div className="subscription-container">
				<div className="subscription-header">
					<h3>Subscription</h3>
					<span className="primary-button">Create Subscription</span>
				</div>

				<div className="subscription-grid">
					<div className="subscription-pack">
						<h5>1 Country Plan</h5>
						<div className="subscription-price">
							$1600 <span>per year</span>
						</div>
						<button className="btn-primary-outline text-uppercase">
							View Subscription
						</button>
					</div>
					<div className="subscription-pack">
						<h5>Essential Plan</h5>
						<div className="subscription-price">
							<div className="promo">Promo</div>$1200{" "}
							<span>per year</span>
						</div>
						<label>$2000 per year</label>
						<button className="btn-primary-outline text-uppercase">
							View Subscription
						</button>
					</div>

					<div className="subscription-pack">
						<h5>Premium Plan</h5>
						<div className="subscription-price">
							$2400 <span>per year</span>
						</div>
						<button className="btn-primary-outline text-uppercase">
							View Subscription
						</button>
					</div>
					<div className="subscription-pack">
						<h5>Enterprise Plan</h5>
						<div className="subscription-price">
							$3600 <span>per year</span>
						</div>
						<button className="btn-primary-outline text-uppercase">
							View Subscription
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Subscriptions;
