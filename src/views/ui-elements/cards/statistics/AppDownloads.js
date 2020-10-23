import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { DownloadCloud } from "react-feather";
import { quaterlySales, quaterlySalesSeries } from "./StatisticsData";

class AppDownloads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideChart: true,
      appDownloads: 0,
      appDownloadsGraphData: [],
    };
  }
  componentDidMount() {
    this.setState({ appDownloads: this.props.appDownloads });
    if (this.props.appDownloadsGraphData) {
      this.setState({
        appDownloadsGraphData: this.props.appDownloadsGraphData,
        hideChart: false,
      });
    }
  }
  render() {
    return (
      <StatisticsCard
        icon={<DownloadCloud className="danger" size={22} />}
        iconBg="danger"
        stat={this.state.appDownloads}
        statTitle="App Downloads"
        options={quaterlySales}
        series={this.state.appDownloadsGraphData}
        type="area"
        hideChart={this.state.hideChart}
      />
    );
  }
}
export default AppDownloads;
